const ServerTest = async () => {
  console.log("Hello from the Server Side rendered page (by default).");
  console.log("Here we can directly use this as proper SSR page.");
  console.log(
    "Or pass props from this server component to the client component which requires interactivity."
  );
  console.log("Recommended to do mutations using RTK client side apis.");
  console.log("Use server components when require build time static pages or run time ssr pages. With SEO meta data.");
  console.log("With fetch only requests (e.g. fetching products)");
  return <div>ServerTest</div>;
};

export default ServerTest;
