"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../../app.module");
const user_service_1 = require("../services/user.service");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userService = app.get(user_service_1.UserService);
    const users = [
        {
            name: 'João Silva',
            email: 'joao@example.com',
        },
        {
            name: 'Maria Santos',
            email: 'maria@example.com',
        },
        {
            name: 'Pedro Oliveira',
            email: 'pedro@example.com',
        },
        {
            name: 'Ana Costa',
            email: 'ana@example.com',
        },
    ];
    console.log('🌱 Starting database seeding...');
    for (const userData of users) {
        try {
            const user = await userService.create(userData);
            console.log(`✅ Created user: ${user.name} (${user.email})`);
        }
        catch (error) {
            console.log(`⚠️  User ${userData.email} already exists or error occurred`);
        }
    }
    console.log('🎉 Database seeding completed!');
    await app.close();
}
seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map