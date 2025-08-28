import s from "./page-not-found.module.scss";

const PageNotFound = () => {
  return (
    <div className={s.wrapper}>
      <h1>404</h1>
      <h3>Page could not be found.</h3>
      <p>Please refresh the page or try some different url.</p>
    </div>
  );
};

export default PageNotFound;
