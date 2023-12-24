import SignedInUser from "./SignedInUser";

const Log = () => {
  const user = SignedInUser();
  console.log(user.log);

  return (
    <div>
      <h2>Logg</h2>
      <p>{user.log}</p>
    </div>
  );
};

export default Log

