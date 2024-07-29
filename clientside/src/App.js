import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Navbar  from './Components/Navbar.js';

function App() {
  const [employeesData, setEmployeesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  //accending and deccendig order, below states
  const [sortAgeOrder, setSortAge] = useState('asc');
  const [sortId, setSortId] = useState('asc');
  const [sortName, setSortName] = useState('asc');

  // below states are for pagination.
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch all the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch('https://dummyjson.com/users');
        let userData = await response.json();
        // setEmployeesData(userData.users);
        setFilteredData(userData.users);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Filter the data gender-wise
  useEffect(() => {
    {
      selectedGender === '' ? setFilteredData(employeesData) :
      setFilteredData(employeesData.filter(item => item.gender === selectedGender));
    }
  }, [selectedGender, employeesData]);


  // sorting by ID
  const sortDataById = () => {
    const order = sortId === 'asc' ? 'desc' : 'asc';
    setSortId(order);

    const sortedData = [...filteredData].sort((a, b) => {
      return order === 'asc' ? a.id - b.id : b.id - a.id;
    });

    setFilteredData(sortedData);
  };


  //sort by age
  const sortDataByAge = () => {
    const order = sortAgeOrder === 'asc' ? 'desc' : 'asc';
    setSortAge(order);

    const sortedData = [...filteredData].sort((a, b) => {
      return order === 'asc' ? a.age - b.age : b.age - a.age;
    });

    setFilteredData(sortedData);
  };

  // sorting by Full Name
  const sortDataByName = () => {
    const order = sortName === 'asc' ? 'desc' : 'asc';
    setSortName(order);

    const sortedData = [...filteredData].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toUpperCase();
      const nameB = `${b.firstName} ${b.lastName}`.toUpperCase();
      if (order === 'asc') {
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      } else {
        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1;
        return 0;
      }
    });

    setFilteredData(sortedData);
  };

  const changeGender = (gender) => {
    setSelectedGender(gender);
  };

  // Pagination 
  const lastRec = currentPage * recordsPerPage;


  console.log("last rec..", lastRec)

  const FirstRec = lastRec - recordsPerPage;
  console.log("1st record", FirstRec)

  const currentRec = filteredData.slice(FirstRec, lastRec);
  console.log("current rec ", currentRec)

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  console.log("total pages", totalPages)



  // btn for change the page 
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };



  return (
    <>
    <div className="container parent-container mt-5">

    {/* navbar  */}
     <Navbar />

      <div className="row">
        <div className="col">
          <h1>Employees</h1>
        </div>
        <div className="col">
          <div className="filters">
            <div className='filter-icon'>
            <i className="fa-solid fa-filter"></i>
            </div>
            <Dropdown>
              <Dropdown.Toggle variant="dark">
                Country
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {
                  employeesData.map((dropdownItem) =>
                    <Dropdown.Item to="/">{dropdownItem.address.state}</Dropdown.Item>
                  )
                }
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle variant="dark">
                Gender
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeGender('male')}>Male</Dropdown.Item>
                <Dropdown.Item onClick={() => changeGender('female')}>Female</Dropdown.Item>
                <Dropdown.Item onClick={() => changeGender('')}>All</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className='mt-5' style={{ borderRadius: '20px', border: '1px solid #e0e0e0', padding: '24px' }}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={sortDataById}>ID <i className="fa-solid fa-sort"></i></th>
              <th>Image</th>
              <th onClick={sortDataByName}>Full Name <i className="fa-solid fa-sort"></i></th>
              <th onClick={sortDataByAge}>Demography</th>
              <th>Designation</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {currentRec.map((item) => (
              <tr key={item.id}>
                <td>{item.id < 10 ? `0${item.id}` : item.id}</td>
                <td>
                  <img
                    src={item.image}
                    alt="placeholder"
                    className="rounded-circle"
                    height='45px'
                    width='45px'
                  />
                </td>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.gender === "male" ? "M" : "F"}/{item.age}</td>
                <td>{item.company.title}</td>
                <td>{item.address.state}, {item.address.country === "United States" ? "USA" : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination mt-4">
        <button onClick={prevPage} >Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
    </>
  );
}

export default App;
