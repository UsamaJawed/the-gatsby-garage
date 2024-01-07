const path = require("path");
const { assignIds } = require("@webdeveducation/wp-block-tools");
const fs = require("fs");

exports.createPages = async ({ actions, graphql }) => {
  const pageTemplate = path.resolve("src/templates/page.js");

  const { createPage } = actions;

  const { data } = await graphql(`
    query AllPagesQuery {
      wp {
        themeStylesheet
      }
      allWpPage {
        nodes {
          databaseId
          blocks
          uri
        }
      }
    }
  `);

  try {
    fs.writeFileSync("./public/themeStylesheet.css", data.wp.themeStylesheet);
  } catch (e) {}
  for (let i = 0; i < data.allWpPage.nodes.length; i++) {
    const page = data.allWpPage.nodes[i];
    let blocks = page.blocks;
    blocks = assignIds(blocks);
    createPage({
      path: page.uri,
      component: pageTemplate,
      context: {
        blocks,
      },
    });
  }
};
