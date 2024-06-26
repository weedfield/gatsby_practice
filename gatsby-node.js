// このファイルではcreatePagesというGatsbyのデフォルトAPIを用いて詳細ページを動的に生成する。


// ページのパスを決める
const path = require("path")


exports.createPages = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions

    // 記事詳細データの取得
    const result = await graphql(
        `
        {
          allContentfulPost {
            edges {
              node {
                title
                image {
                  file {
                    url
                  }
                }
                body {
                  childMarkdownRemark {
                    html
                  }
                }
                updatedAt(locale: "ja-JP", formatString: "YYYY年MM月DD日")
                description {
                  description
                }
                slug
              }
            }
          }
        }
        `
    )

    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`)
        return
    }

    const { edges } = result.data.allContentfulPost

    // ページの作成
    edges.forEach(edge => {
        createPage({
            path: `/post/${edge.node.slug}/`,
            component: path.resolve("./src/templates/post.js"),
            context: { post: edge.node }
        })
    });
}