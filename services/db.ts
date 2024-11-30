import { neon } from '@neon/serverless';

class Database {
  private static instance: Database;
  private sql: ReturnType<typeof neon>;

  private constructor() {
    const databaseUrl = Deno.env.get('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    this.sql = neon(databaseUrl);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient() {
    return this.sql;
  }
}

export const db = Database.getInstance();
export const sql = db.getClient();
