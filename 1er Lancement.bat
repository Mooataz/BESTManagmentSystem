@echo off
cd /d "%~dp0"

echo ========================================
echo  Seed - Insertion des donnees initiales
echo ========================================

REM --- Lire .env ---
for /f "usebackq delims=" %%i in (".env") do (
    for /f "tokens=1,* delims==" %%a in ("%%i") do (
        echo %%a | findstr /v "^#" >nul && set "%%a=%%b"
    )
)

REM --- Injecter PGPASSWORD pour psql ---
set PGPASSWORD=%DB_PASSWORD%

echo.
echo [1/6] TypeModel...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME% -c "
INSERT INTO type_model (description) VALUES
('Smart phone'),
('Tablette'),
('Smart watch'),
('Feature phone')
ON CONFLICT DO NOTHING;
"

echo [2/6] LevelRepair...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME% -c "
INSERT INTO level_repair (name, price) VALUES
('L0', '0'),
('L1', '10'),
('L2', '25')
ON CONFLICT DO NOTHING;
"

echo [3/6] AllPart...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME% -c "
INSERT INTO all_part (description) VALUES
('Carte mère'),
('Appareille complet'),
('Câble USB'),
('Ecouteur'),
('Chargeur')
ON CONFLICT DO NOTHING;
"

echo [4/6] RepairAction...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME% -c "
INSERT INTO repair_action (name) VALUES
('Réparation'),
('Devis'),
('Nouvelle appareille')
ON CONFLICT DO NOTHING;
"

echo [5/6] Tables simples (ExpertiseReason, NotesCustomer, CustomerRequest, ListFault, Accessory)...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME% -c "
INSERT INTO expertise_reason (name) VALUES
('Traçe d''intervention'),
('Traçe d''oxydation'),
('Hors pèriode de garantie'),
('Pas notre produit')
ON CONFLICT DO NOTHING;

INSERT INTO notes_customer (name) VALUES
('Vèrifier votre couverture réseau'),
('Changer les cartes SIM'),
('Changer votre chargeur')
ON CONFLICT DO NOTHING;

INSERT INTO customer_request (name) VALUES
('Traitement en urgence'),
('Nettoyage'),
('Sauvgarder les données')
ON CONFLICT DO NOTHING;

INSERT INTO list_fault (name) VALUES
('Non fonctionnelle'),
('Ne charge pas'),
('Ne detecte pas la carte SIM')
ON CONFLICT DO NOTHING;

INSERT INTO accessory (name) VALUES
('Chargeur filaire'),
('Chargeur sans fil'),
('Ecouteur'),
('Packet')
ON CONFLICT DO NOTHING;
"

echo [6/6] Utilisateur administrateur...
REM Appelle Node.js pour hasher le mot de passe avec argon2 et inserer
node "%~dp0seed-user.js"

echo.
echo ====== Seed termine ======
pause
