<template>
    <div>
        <div class="dockerHost-list my-4">
            <p v-if="$root.zodSchemaList.length === 0">
                {{ $t("Not available, please setup.") }}
            </p>

            <ul class="list-group mb-3" style="border-radius: 1rem">
                <li
                    v-for="(zodSchema, index) in $root.zodSchemaList"
                    :key="index"
                    class="list-group-item"
                >
                    {{ zodSchema.name }}<br />
                    <a
                        href="#"
                        @click="$refs.ZodSchemaDialog.show(zodSchema.id)"
                        >{{ $t("Edit") }}</a
                    >
                </li>
            </ul>

            <button
                class="btn btn-primary me-2"
                type="button"
                @click="$refs.ZodSchemaDialog.show()"
            >
                <font-awesome-icon icon="plus" /> {{ $t("Add Remote Browser") }}
            </button>
        </div>

        <div class="my-4 pt-4">
            <h5 class="my-4 settings-subheading">
                {{ $t("What is a Remote Browser?") }}
            </h5>
            <p>
                {{ $t("zodSchemasDescription") }}
                <a href="https://hub.docker.com/r/browserless/chrome">{{
                    $t("self-hosted container")
                }}</a>
            </p>
        </div>

        <ZodSchemaDialog ref="ZodSchemaDialog" />
    </div>
</template>

<script>
import ZodSchemaDialog from "../../components/ZodSchemaDialog.vue";

export default {
    components: {
        ZodSchemaDialog,
    },

    data() {
        return {};
    },

    computed: {
        settings() {
            return this.$parent.$parent.$parent.settings;
        },
        saveSettings() {
            return this.$parent.$parent.$parent.saveSettings;
        },
        settingsLoaded() {
            return this.$parent.$parent.$parent.settingsLoaded;
        },
    },
};
</script>
