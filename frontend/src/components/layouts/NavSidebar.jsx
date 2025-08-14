import { Link } from 'react-router-dom';

export default function NavSidebar({ open }) {
  return (
    <aside className={`bg-white border-r ${open ? 'block' : 'hidden'} md:block w-56 p-3`}>
      <nav className="flex flex-col gap-3">
        <Link to="/">Home</Link>
        <Link to="/channel/create">Create Channel</Link>
      </nav>
    </aside>
  );
}
