module.exports = {
  'no-data-name': {
    create: function (context) {
      return {
        Identifier(node) {
          if (
            node.name === 'data' &&
            (node.parent.type === 'VariableDeclarator' || node.parent.computed || node.parent.object === node)
          ) {
            context.report(node, 'Do not use the variable name "data"');
          }
        },
      };
    },
  },
};
