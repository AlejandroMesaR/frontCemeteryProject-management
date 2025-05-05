import { FaHome} from 'react-icons/fa';

function Header() {
  return (
    <header className="flex items-center justify-between mb-3 bg-gray-200 py-3 px-5">
      <div>
        <div className="flex">
          <FaHome className='text-4xl text-black' />
          <h1  className="text-3xl font-bold text-black pt-1 pl-2">Inicio </h1>
        </div>
        <p className="pl-4 text-gray-700 mt-1">Información general acerca de el cementerio</p>
      </div>
    </header>
  );
}

export default Header;
