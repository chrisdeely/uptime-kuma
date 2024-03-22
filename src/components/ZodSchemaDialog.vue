<template>
    <form @submit.prevent="submit">
        <div
            ref="modal"
            class="modal fade"
            tabindex="-1"
            data-bs-backdrop="static"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="exampleModalLabel" class="modal-title">
                            {{ $t("Add a Zod Schema") }}
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="zod-schema-name" class="form-label">{{
                                $t("Friendly Name")
                            }}</label>
                            <input
                                id="zod-schema-name"
                                v-model="zodSchema.name"
                                type="text"
                                class="form-control"
                                required
                            />
                        </div>

                        <div class="mb-3">
                            <label for="zod-schema-text" class="form-label">{{
                                $t("Zod Schema Text")
                            }}</label>
                            <input
                                id="zod-schema-text"
                                v-model="zodSchema.schema"
                                type="textarea"
                                class="form-control"
                                required
                            />

                            <div class="form-text mt-3">
                                {{ $t("Examples") }}:
                                <ul>
                                    <li>
                                        z.object( { id: z.number(), count:
                                        z.number(), name: z.string() } )
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button
                            v-if="id"
                            type="button"
                            class="btn btn-danger"
                            :disabled="processing"
                            @click="deleteConfirm"
                        >
                            {{ $t("Delete") }}
                        </button>
                        <button
                            type="button"
                            class="btn btn-warning"
                            :disabled="processing"
                            @click="test"
                        >
                            {{ $t("Test") }}
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                            :disabled="processing"
                        >
                            <div
                                v-if="processing"
                                class="spinner-border spinner-border-sm me-1"
                            ></div>
                            {{ $t("Save") }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <Confirm
        ref="confirmDelete"
        btn-style="btn-danger"
        :yes-text="$t('Yes')"
        :no-text="$t('No')"
        @yes="deleteZodSchema"
    >
        {{ $t("deleteZodSchemaMessage") }}
    </Confirm>
</template>

<script>
import { Modal } from "bootstrap";
import Confirm from "./Confirm.vue";

export default {
    components: {
        Confirm,
    },
    props: {},
    emits: ["added"],
    data() {
        return {
            modal: null,
            processing: false,
            id: null,
            zodSchema: {
                name: "",
                schema: "",
                // Do not set default value here, please scroll to show()
            },
        };
    },

    mounted() {
        this.modal = new Modal(this.$refs.modal);
    },
    methods: {
        /**
         * Confirm deletion of schema
         * @returns {void}
         */
        deleteConfirm() {
            this.modal.hide();
            this.$refs.confirmDelete.show();
        },

        /**
         * Show specified schema
         * @param {number} zodSchemaID ID of host to show
         * @returns {void}
         */
        show(zodSchemaID) {
            if (zodSchemaID) {
                let found = false;

                this.id = zodSchemaID;

                for (let n of this.$root.zodSchemaList) {
                    if (n.id === zodSchemaID) {
                        this.zodSchema = n;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.$root.toastError(this.$t("Zod Schema not found!"));
                }
            } else {
                this.id = null;
                this.zodSchema = {
                    name: "",
                    schema: "",
                };
            }

            this.modal.show();
        },

        /**
         * Add schema
         * @returns {void}
         */
        submit() {
            this.processing = true;
            this.$root
                .getSocket()
                .emit("addZodSchema", this.zodSchema, this.id, (res) => {
                    this.$root.toastRes(res);
                    this.processing = false;

                    if (res.ok) {
                        this.modal.hide();

                        // Emit added event, doesn't emit edit.
                        if (!this.id) {
                            this.$emit("added", res.id);
                        }
                    }
                });
        },

        /**
         * Test the schema
         * @returns {void}
         */
        test() {
            this.processing = true;
            this.$root
                .getSocket()
                .emit("testZodSchema", this.zodSchema, (res) => {
                    this.$root.toastRes(res);
                    this.processing = false;
                });
        },

        /**
         * Delete this schema
         * @returns {void}
         */
        deleteZodSchema() {
            this.processing = true;
            this.$root.getSocket().emit("deleteZodSchema", this.id, (res) => {
                this.$root.toastRes(res);
                this.processing = false;

                if (res.ok) {
                    this.modal.hide();
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.dark {
    .modal-dialog .form-text,
    .modal-dialog p {
        color: $dark-font-color;
    }
}
</style>
