import 'reflect-metadata';
import { createNewUser, findOneByEmail } from '../modules/user/user.service';
import { UserRole } from '../modules/user/user.entity';
import db from '../database/db';

const main = async () => {
  await db.initialize();

  try {
    const email = 'admin@example.com'

    const isEmailExist = await findOneByEmail(email)
    if (isEmailExist) {
      console.log('Admin already exist.')
      return;
    }

    await createNewUser({
      firstName: 'admin',
      lastName: 'admin',
      email,
      role: UserRole.ADMIN,
    });
  } finally {
    await db.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed admin user:', error);
  process.exitCode = 1;
});