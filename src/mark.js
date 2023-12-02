export const rules = {
    headers: [
        { pattern: /##\s*([^\n]+)/g, replacement: '<h2>$1</h2>' }
    ],
    emphasis: [
        { pattern: /\*([^*]+)\*/g, replacement: '<em>$1</em>' }
    ],
    strong: [
        { pattern: /\*\*([^*]+)\*\*/g, replacement: '<strong>$1</strong>' }
    ],
    list: [
        { pattern: /- (.+?)\n/g, replacement: '<li>$1</li>' }
    ],
    inlineCode: [
        { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' }
    ],
    codeBlock: [
        { pattern: /```([\s\S]+?)```/g, replacement: '<pre><code>$1</code></pre>' }
    ],
    link: [
        { pattern: /\[([^\]]+)]\(([^)]+)\)/g, replacement: '<a href="$2">$1</a>' }
    ]
};

export function parseMarkdown(markdown, rules) {
    let htmlOutput = markdown;

    // Apply each rule group
    Object.values(rules).forEach(ruleGroup => {
        htmlOutput = applyRules(htmlOutput, ruleGroup);
    });

    // Additional processing if needed

    return htmlOutput;
}

function applyRules(inputHtml, ruleGroup) {
    ruleGroup.forEach(rule => {
        inputHtml = inputHtml.replace(rule.pattern, rule.replacement);
    });
    return inputHtml;
}