import Head from 'next/head'
import Container from './Container'

export default function ErrorPage({ errorData }) {
  console.log({ errorData })
  return (
    <>
      <Head>
        <title>Error</title>
      </Head>
      <Container>
        <div className="mx-auto flex h-[70vh] max-w-none flex-col items-center justify-center gap-y-3 sm:max-w-xl lg:max-w-3xl">
          <h2 className="text-lg text-gray-900 sm:text-xl">{errorData?.data?.status ? `${errorData.data.status} error`: `Unknown error`}</h2>
          <h1 className="text-4xl mb-5 text-gray-700 sm:text-5xl">Sorry, an error occured.</h1>
          <p>{errorData?.code && `Code: ${errorData.code}`}</p>
          <p>{errorData?.code && `Message: ${errorData.message}`}</p>
        </div>
      </Container>
    </>
  )
}
