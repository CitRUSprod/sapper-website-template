const commitTypes = require("./types.json")

function convertCommitTypes(typesObject = {}) {
    const typeNames = Object.keys(typesObject)

    const maxLength = typeNames.reduce((max, typeName) => {
        if (max < typeName.length) {
            return typeName.length
        }
        return max
    }, 0)

    const types = typeNames.reduce((acc, typeName) => {
        const spacing = " ".repeat(maxLength - typeName.length)
        acc.push({
            name: `${typeName}:${spacing} ${typesObject[typeName]}`,
            value: typeName
        })
        return acc
    }, [])

    return types
}

module.exports = {
    types: convertCommitTypes(commitTypes),
    allowCustomScopes: true,
    allowBreakingChanges: ["feat", "fix"],
    skipQuestions: ["body", "footer"],
    upperCaseSubject: true
}
