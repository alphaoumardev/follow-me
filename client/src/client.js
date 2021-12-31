import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'


export const client = sanityClient(
    {
        projectId:process.env.REACT_APP_SANITY_PROJECT_ID,
        dataset:'production',
        apiVersion:'2021-12-25',
        useCdn:true,
        token:process.env.REACT_APP_SANITY_TOKEN,
        // ignoreBrowserTokenWarning: true
    })
const builder = imageUrlBuilder(client)

export const urlFor=(source)=>builder.image(source)

// import sanityClient from '@sanity/client';
// import imageUrlBuilder from '@sanity/image-url';
//
// export const client = sanityClient({
//         projectId:'86poc7qz' ,
//         dataset: 'production',
//         apiVersion: '2021-12-26',
//         useCdn: true,
//         token: 'skWboWBnN1CbVXoFb27OXMPz6dTkhXdLCOVYeJkmcHHFx4lUtxNstdkdisxq8Yeu6ywurCUL75qURGxOgtcqTPOqaT5hIbGqnfl67KnT2NhoQw7gwtM6m91THiWe6g3hVDxw6MHVendeYP1LdPUzaTWwDnIaliVz2kJ1vYQxfjJMjfqwaYQc'
// });
//
// const builder = imageUrlBuilder(client);
//
// export const urlFor = (source) => builder.image(source);
