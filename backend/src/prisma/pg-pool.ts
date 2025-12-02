
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import config from '../../prisma.config.js'; 
let _adapter: PrismaPg;

export const getPgAdapter = () => {
  if (_adapter) return _adapter;

  const connectionString = config.datasource?.url;
;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is missing! Make sure .env file is loaded and contains DATABASE_URL=...',
    );
  }

  const pool = new Pool({ connectionString });
  _adapter = new PrismaPg(pool);
  return _adapter;
};

// Export as default too for easy import
export const adapter = getPgAdapter();
