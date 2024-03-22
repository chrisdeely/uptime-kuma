const { BeanModel } = require("redbean-node/dist/bean-model");

class ZodSchema extends BeanModel {
    /**
     * Returns an object that ready to parse to JSON
     * @returns {object} Object ready to parse
     */
    toJSON() {
        return {
            id: this.id,
            schema: this.schema,
            name: this.name,
        };
    }
}

module.exports = ZodSchema;
