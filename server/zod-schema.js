const { R } = require("redbean-node");

class ZodSchema {
    /**
     * Gets Zod schema from ID
     * @param {number} zodSchemaID ID of the Zod Schema
     * @returns {Promise<Bean>} Zod Schema
     */
    static async get(zodSchemaID) {
        let bean = await R.findOne("zod_schema", " id = ? ", [zodSchemaID]);

        if (!bean) {
            throw new Error("Zod Schema not found");
        }

        return bean;
    }

    /**
     * Save a Zod Schema
     * @param {object} zodSchema Zod Schema to save
     * @param {?number} zodSchemaID ID of the Zod Schema to update
     * @returns {Promise<Bean>} Updated Zod Schema
     */
    static async save(zodSchema, zodSchemaID) {
        let bean;

        if (zodSchemaID) {
            bean = await R.findOne("zod_schema", " id = ? ", [zodSchemaID]);

            if (!bean) {
                throw new Error("Zod Schema not found");
            }
        } else {
            bean = R.dispense("zod_schema");
        }

        bean.name = zodSchema.name;
        bean.schema = zodSchema.schema;

        await R.store(bean);

        return bean;
    }

    /**
     * Delete a Zod Schema
     * @param {number} zodSchemaID ID of the Zod Schema to delete
     * @returns {Promise<void>}
     */
    static async delete(zodSchemaID) {
        let bean = await R.findOne("zod_schema", " id = ? ", [zodSchemaID]);

        if (!bean) {
            throw new Error("Zod Schema not found");
        }

        // Delete removed Zod Schema from monitors if exists
        await R.exec(
            "UPDATE monitor SET zod_schema = null WHERE zod_schema = ?",
            [zodSchemaID]
        );

        await R.trash(bean);
    }
}

module.exports = {
    ZodSchema,
};
