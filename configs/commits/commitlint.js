const commitTypes = require("./types.json")

module.exports = {
    rules: {
        "body-max-length": [2, "always", 0],
        "footer-leading-blank": [2, "always"],
        "header-max-length": [2, "always", 72],
        "scope-case": [2, "always", "kebab-case"],
        "subject-case": [2, "always", "sentence-case"],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "type-enum": [2, "always", Object.keys(commitTypes)]
    }
}
