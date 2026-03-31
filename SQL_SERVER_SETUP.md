# SQL Server Setup Guide for Rice Classification System

## Overview

The application has been migrated from MongoDB to SQL Server Management Studio (SSMS). This guide explains how to set up and configure SQL Server for the rice classification system.

## Prerequisites

- **SQL Server 2019 or later** (Express, Standard, or Enterprise Edition)
- **SQL Server Management Studio (SSMS) 21**
- **Node.js 18+** (already installed)

## Installation & Configuration

### 1. Install SQL Server 2019/2022

#### Windows Installation

1. Download SQL Server installer from <https://www.microsoft.com/en-us/sql-server/sql-server-downloads>
2. Run the installer and select **"Express"** or **"Developer Edition"** for development
3. Choose **"Custom"** installation
4. Install with these components:
   - Database Engine Services
   - SQL Server Management Studio (SSMS)

#### Default Credentials (Development)

- **Server Name**: `localhost` or `LAPTOP-XXXX\SQLEXPRESS` (for Express Edition)
- **Authentication**: SQL Server Authentication
- **Username**: `sa` (System Administrator)
- **Password**: Set during installation (default: `YourPassword123!`)

### 2. Start SQL Server Service

#### Windows Services

```bash
# Open Services
services.msc

# Find and start:
# - SQL Server (SQLEXPRESS) - if using Express Edition
# - SQL Server Agent (optional)
```

#### Using NET command

```bash
# Start SQL Server Express
net start MSSQL$SQLEXPRESS

# View status
sc query MSSQL$SQLEXPRESS
```

#### Using SQL Server Configuration Manager

1. Open **SQL Server Configuration Manager**
2. Go to **SQL Server Services**
3. Right-click **SQL Server (SQLEXPRESS)** → **Start**

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# SQL Server Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_NAME=rice_classifier

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Verify SQL Server Connection

#### Using SSMS

1. Open **SQL Server Management Studio**
2. **Server name**: `localhost` or `LAPTOP-XXXX\SQLEXPRESS`
3. **Authentication**: SQL Server Authentication
4. **Username**: `sa`
5. **Password**: (your configured password)
6. Click **Connect**

#### Using Command Line (sqlcmd)

```bash
# Download sqlcmd from: https://learn.microsoft.com/en-us/sql/tools/sqlcmd-utility
sqlcmd -S localhost -U sa -P YourPassword123! -Q "SELECT @@VERSION"
```

### 5. Create Database

The database will be **automatically created** on first run because `synchronize: true` is enabled in development mode.

To manually create the database in SSMS:
```sql
CREATE DATABASE rice_classifier;
GO

USE rice_classifier;
GO

-- Verify creation
SELECT name FROM sys.databases WHERE name = 'rice_classifier';
```

### 6. Build and Start Application

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the application
npm run build

# Start development server
npm run start:dev
```

Expected output:
```
[Nest] XXXXX  - 30/03/2569 11:00:00     LOG [NestFactory] Starting Nest application...
🧠 ML Simulator Model initialized
[Nest] XXXXX  - 30/03/2569 11:00:01     LOG [TypeOrmModule] TypeORM initialized successfully
[Nest] XXXXX  - 30/03/2569 11:00:01     LOG [InstanceLoader] ClassificationModule dependencies initialized
[Nest] XXXXX  - 30/03/2569 11:00:01     LOG [NestApplicationContext] Nest application successfully started
```

### 7. Access the Application

- **Frontend**: <http://localhost:3001>
- **API Documentation**: <http://localhost:3001/api/docs>
- **Classification Archive**: <http://localhost:3001/archive.html>

## Troubleshooting

### SQL Server Won't Connect

- ✅ Verify SQL Server service is running: `Get-Service MSSQL$SQLEXPRESS | Start-Service`
- ✅ Check firewall allows port 1433
- ✅ Verify credentials in `.env` file match your SQL Server setup

### Database Not Created

- ✅ Check `NODE_ENV=development` in `.env`
- ✅ Verify SQL Server connection in app logs
- ✅ Check TypeORM logging: `logging: true` in app.module.ts

### Port Already in Use

```bash
# Kill process on port 3001
npx kill-port 3001

# Or use different port
PORT=3002 npm run start:dev
```

### Connection Timeout

```bash
# Increase connection timeout in app.module.ts:
connectionTimeout: 30000,
requestTimeout: 30000,
```

## Database Schema

The application creates these tables automatically:

### ClassificationResults Table

```sql
CREATE TABLE [dbo].[ClassificationResults] (
    [id] NVARCHAR(36) PRIMARY KEY,
    [filename] NVARCHAR(MAX) NOT NULL,
    [imagePath] NVARCHAR(MAX) NOT NULL,
    [confidence] DECIMAL(5, 2) NOT NULL,
    [riceType] VARCHAR(50) NOT NULL,
    [grainColor] VARCHAR(50) NOT NULL,
    [morphologyLength] DECIMAL(10, 2) NOT NULL,
    [morphologyWidth] DECIMAL(10, 2) NOT NULL,
    [morphologyAspectRatio] DECIMAL(10, 2) NOT NULL,
    [morphologySurfaceArea] DECIMAL(10, 2) NOT NULL,
    [colorimetricAvgRed] INT NOT NULL,
    [colorimetricAvgGreen] INT NOT NULL,
    [colorimetricAvgBlue] INT NOT NULL,
    [colorimetricLabL] DECIMAL(5, 2) NOT NULL,
    [colorimetricLabA] DECIMAL(5, 2) NOT NULL,
    [colorimetricLabB] DECIMAL(5, 2) NOT NULL,
    [notes] NVARCHAR(MAX),
    [createdAt] DATETIME2 NOT NULL,
    [updatedAt] DATETIME2 NOT NULL
);
```

## Common SQL Server Editions

| Edition    | Use Case                 | SQL Server Port | Pricing  |
| ---------- | ------------------------ | --------------- | -------- |
| Express    | Development, Learning    | 1433            | **FREE** |
| Developer  | Development              | 1433            | **FREE** |
| Standard   | Small to Medium Business | 1433            | Paid     |
| Enterprise | Large Organizations      | 1433            | Paid     |

For development: **Use Express or Developer Edition (both free)**

## Production Configuration

For production, update `app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ClassificationResult],
  synchronize: false, // ⚠️ Set to FALSE in production
  logging: false,
  options: {
    trustServerCertificate: true,
    encrypt: true,
  },
}),
```

**Important**: Set `synchronize: false` in production and use migrations instead.

## Next Steps

1. ✅ Start SQL Server service
2. ✅ Configure `.env` with SQL Server credentials
3. ✅ Run `npm install --legacy-peer-deps`
4. ✅ Run `npm run build`
5. ✅ Run `npm run start:dev`
6. ✅ Access <http://localhost:3001>

## Support

For SQL Server issues:
- Official Docs: <https://learn.microsoft.com/en-us/sql/>
- TypeORM Docs: <https://typeorm.io/>
- Community: <https://stackoverflow.com/questions/tagged/sql-server>
