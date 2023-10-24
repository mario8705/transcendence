import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            email: 'alexislavaud191@gmail.com',
            totpSecret: 'KVAFEKKWOZ4SYZD5JVYWS6KWF5UU4LDCKNBDYUCUGVZVEV3ZJNOQ',
            authMethod: 'password',
            totpEnabled: true,
            password: bcrypt.hashSync('mdp', bcrypt.genSaltSync()),
            // password: 
            //otpauth://totp/SecretKey?secret=KVAFEKKWOZ4SYZD5JVYWS6KWF5UU4LDCKNBDYUCUGVZVEV3ZJNOQ
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
