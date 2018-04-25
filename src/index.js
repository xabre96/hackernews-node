const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (root, args, context, info) => {
            return context.db.query.links({}, info);
        },
    },
    Mutation: {
        post: (root, args, context, info) => {
            return context.db.mutation.createLink({
                data: {
                    url: args.url,
                    description: args.description,
                }
            }, info);
        },
        updateLink: (root, args) => {
            let link = [];

            for (let index = 0; index < links.length; ++index) {
                if (args.id === links[index].id) {
                    links[index].description = args.description;
                    links[index].url = args.url;
                    link = links[index];
                    break;
                }
            }

            return link;
        },
        deleteLink: (root, args) => {
            let link = [];

            for (let index = 0; index < links.length; ++index) {
                if (args.id === links[index].id) {
                    link = links[index];
                    links.splice(index, 1);
                    break;
                }
            }

            return link;
        }
    },
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'https://eu1.prisma.sh/public-swampwitch-125/hackernews-node/dev',
            secret: 'mysecret123',
            debug: true,
        }),
    }),
});

server.start(() => console.log(`Server is runnung on http://localhost:4000`));
