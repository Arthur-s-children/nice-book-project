import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <h1>HEADER</h1>
      <NavLink to="/">Home</NavLink>

      <NavLink to="/catalog?type=paperback">Paper</NavLink>

      <NavLink to="/catalog?type=kindle">Kindle</NavLink>

      <NavLink to="/catalog?type=audiobook">Audiobook</NavLink>
    </div>
  );
};

export default Header;
