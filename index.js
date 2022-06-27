import { sequelize } from "./config/database.js"
import { User } from "./models/user.js"
import { Server } from "./models/server.js"
import { Configuration } from "./models/configuration.js"
import { UserFriends } from "./models/userfriends.js"
import { UserMessageUsers } from "./models/usermessageusers.js"

async function main() {
    await sequelize.sync({force: true});
}

main()