import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'


export const client = sanityClient(
    {
        projectId:process.env.REACT_APP_SANITY_PROJECT_ID,
        dataset:'production',
        apiVersion:'2021-12-25',
        useCdn:false,
        token:process.env.REACT_APP_SANITY_TOKEN,
        ignoreBrowserTokenWarning: true
    })
const builder = imageUrlBuilder(client)

export const urlFor=(source)=>builder.image(source)


// export const writeClient = sanityClient(
//     {
//             projectId: 'some-project-id',
//             dataset: 'my-dataset',
//             token: process.env.SANITY_AUTH_TOKEN,
//             useCdn: false,
//             apiVersion: '2021-08-31'
//     }
// )
//
// export const readClient = sanityClient(
//     {
//         projectId: 'some-project-id',
//         dataset: 'my-dataset',
//         useCdn: true,
//         apiVersion: '2021-08-31'
//     }
// )
