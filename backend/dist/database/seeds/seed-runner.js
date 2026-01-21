"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../../app.module");
const typeorm_1 = require("typeorm");
const seed_1 = require("./seed");
async function runSeed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        await (0, seed_1.seed)(dataSource);
        console.log('✅ Seed completed successfully');
    }
    catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
runSeed();
//# sourceMappingURL=seed-runner.js.map