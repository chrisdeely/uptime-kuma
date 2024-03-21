const { sendZodSchemaList } = require("../client");
const { checkLogin } = require("../util-server");
const { ZodSchema } = require("../zod-schema");

const { log } = require("../../src/util");
const { testZodSchema } = require("../monitor-types/real-browser-monitor-type");

/**
 * Handlers for docker hosts
 * @param {Socket} socket Socket.io instance
 * @returns {void}
 */
module.exports.zodSchemaSocketHandler = (socket) => {
    socket.on("addZodSchema", async (zodSchema, zodSchemaID, callback) => {
        try {
            checkLogin(socket);

            let zodSchemaBean = await ZodSchema.save(zodSchema, zodSchemaID);
            await sendZodSchemaList(socket);

            callback({
                ok: true,
                msg: "Saved.",
                msgi18n: true,
                id: zodSchemaBean.id,
            });
        } catch (e) {
            callback({
                ok: false,
                msg: e.message,
            });
        }
    });

    socket.on("deleteZodSchema", async (zodSchemaId, callback) => {
        try {
            checkLogin(socket);

            await ZodSchema.delete(zodSchemaId);
            await sendZodSchemaList(socket);

            callback({
                ok: true,
                msg: "successDeleted",
                msgi18n: true,
            });
        } catch (e) {
            callback({
                ok: false,
                msg: e.message,
            });
        }
    });

    socket.on("testZodSchema", async (zodSchema, callback) => {
        try {
            checkLogin(socket);
            let check = await testZodSchema(zodSchema.schema);
            log.info("zodSchema", "Tested schema: " + check);
            let msg;

            if (check) {
                msg = "Valid Zod Schema";
            }

            callback({
                ok: true,
                msg,
            });
        } catch (e) {
            log.error("zodSchema", e);

            callback({
                ok: false,
                msg: e.message,
            });
        }
    });
};
