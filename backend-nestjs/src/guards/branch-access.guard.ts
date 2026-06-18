import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repair } from 'src/repair/entities/repair.entity';

@Injectable()
export class BranchAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepositry: Repository<User>,
    @InjectRepository(Repair) private readonly repairRepositry: Repository<Repair>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const jwtPayload = req.user as { sub: number } | undefined;
    if (!jwtPayload) throw new ForbiddenException('Non authentifié');

    const user = await this.userRepositry.findOne({
      where: { id: jwtPayload.sub },
      relations: ['branch'],
    });
    if (!user) throw new ForbiddenException('Utilisateur introuvable');

    if (user.role?.some(r => r === 'Administrateur')) return true;

    if (!user?.branch?.id) throw new ForbiddenException('Utilisateur sans agence');

    const userBranchId = user.branch.id;
    const repairId = req.params.id ? +req.params.id : undefined;

    // Endpoints with :id param — check repair branch
    if (repairId) {
      const repair = await this.repairRepositry.findOne({
        where: { id: repairId },
      });
      if (!repair) throw new NotFoundException('Réparation introuvable');
      if (repair.actuellybranch !== userBranchId) {
        throw new ForbiddenException('Accès refusé : cette réparation ne fait pas partie de votre agence');
      }
      req.repair = repair; // attach for downstream use
      return true;
    }

    // Endpoint without :id — attach branchId to request for service use
    req.userBranchId = userBranchId;
    return true;
  }
}
