export default async function regenerateStaticPage(req, res) {
  const { pathname } = req.query;

  try {
    await res.revalidate(pathname).catch((err) => {
      throw `Page Revalidation ${err}`;
    });

    console.log("Revalidating page: ", pathname);
    return res.json({ page: pathname, revalidated: true });
  } catch (error) {
    return res.status(500).send({ error: error, slug: pathname });
  }
}
