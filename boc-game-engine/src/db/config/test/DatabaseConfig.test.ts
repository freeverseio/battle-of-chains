import dbConfig from '../DatabaseConfig';
import { DbKey } from '../DbKey';

describe('DatabaseConfig Singleton', () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeAll(() => {
			originalEnv = { ...process.env };
	});

	afterEach(() => {
			process.env = { ...originalEnv };
			jest.restoreAllMocks();
	});

	beforeEach(() => {
			jest.resetModules();
	});

  test('should return the same instance', () => {
    const instance1 = dbConfig;
    const instance2 = dbConfig;

    expect(instance1).toBe(instance2);
  });

  test('should return the default read DB', () => {
    const currentReadDb = dbConfig.getCurrentReadDb();

    expect(currentReadDb.name).toBe(DbKey.A);
    expect(currentReadDb.host).toBe('localhost');
  });

  test('should switch current read DB', () => {
    dbConfig.switchCurrentReadDB();

    expect(dbConfig.getCurrentReadDb().name).toBe(DbKey.B);

    dbConfig.switchCurrentReadDB();

    expect(dbConfig.getCurrentReadDb().name).toBe(DbKey.A);
  });

  test('should throw an error when switching invalid read DB', () => {
    const invalidDbKey = 'C' as DbKey;
    expect(() => dbConfig.setCurrentReadDb(invalidDbKey)).toThrow(
      `Invalid database configuration name: '${invalidDbKey}'.`
    );
  });

  test('should return the default write DB', () => {
    const currentWriteDb = dbConfig.getCurrentWriteDb();

    expect(currentWriteDb.name).toBe(DbKey.B);
    expect(currentWriteDb.host).toBe('localhost');
  });

  test('should switch current write DB', () => {
    dbConfig.switchCurrentWriteDB();

    expect(dbConfig.getCurrentWriteDb().name).toBe(DbKey.A);

    dbConfig.switchCurrentWriteDB();

    expect(dbConfig.getCurrentWriteDb().name).toBe(DbKey.B);
  });

  test('should return all DB configurations', () => {
    const dbConfigs = dbConfig.getDbConfigs();

    expect(dbConfigs[DbKey.A].name).toBe(DbKey.A);
    expect(dbConfigs[DbKey.B].name).toBe(DbKey.B);
  });

	test('should initialize DB configuration with environment variables', async () => {
		process.env.DB_HOST_A = 'custom-host';
		process.env.DB_PORT_A = '9999';
	
		const { default: newDbConfig } = await import('../DatabaseConfig');
		const dbA = newDbConfig.getDbConfigs()[DbKey.A];
	
		expect(dbA.host).toBe('custom-host');
		expect(dbA.port).toBe(9999);
	});
});
