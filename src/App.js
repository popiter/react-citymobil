import React, {useEffect, useState} from "react";
import Service from "./API service";
import M from 'materialize-css'
import Loader from "./loader";

function App () {
	const [cars, setCars] = useState(null);
	const [defaultCars, setDefaultCars] = useState(null);
	const [tariffs, setTariffs] = useState(null);
	const [loading, setLoading] = useState(true);
	const [increase, setIncrease] = useState(true);
	const [currentCar, setCurrentCar] = useState(null);
	const [sortIcon, setSortIcon] = useState('mark');
	const [textSearch, setTextSearch] = useState('');
	const service = new Service()

	useEffect(() => {
		M.Sidenav.init(document.querySelectorAll('.sidenav'))
		M.Modal.init(document.querySelectorAll('.modal'))
		service.getCars()
			.then(getCars => {
				console.log(getCars)
				setCars(getCars.cars)
				setDefaultCars(getCars.cars)
				setTariffs(getCars.tariffs_list)
				setLoading(false)
			})
	}, []);

	const sortCars = (paramSort) => {
		if (!increase) {
			if (paramSort === 'mark') {
				let sortCars = cars.sort((a, b) => {
					if (a[paramSort] > b[paramSort]) return 1
					if (a[paramSort] < b[paramSort]) return -1
					return 0
				})
				setCars([...sortCars])
			} else {
				let sortCars = cars.sort((a, b) => {
					let someA = a.tariffs[paramSort] ? a.tariffs[paramSort].year : Number.MAX_SAFE_INTEGER
					let someb = b.tariffs[paramSort] ? b.tariffs[paramSort].year : Number.MAX_SAFE_INTEGER
					if (someA > someb) return 1
					if (someA < someb) return -1
					return 0
				})
				setCars([...sortCars])
			}
		} else {
			if (paramSort === 'mark') {
				let sortCars = cars.sort((a, b) => {
					if (a[paramSort] < b[paramSort]) return 1
					if (a[paramSort] > b[paramSort]) return -1
					return 0
				})
				setCars([...sortCars])
			} else {
				let sortCars = cars.sort((a, b) => {
					let someA = a.tariffs[paramSort] ? a.tariffs[paramSort].year : 0
					let someb = b.tariffs[paramSort] ? b.tariffs[paramSort].year : 0
					if (someA < someb) return 1
					if (someA > someb) return -1
					return 0
				})
				setCars([...sortCars])
			}
		}
	}

	const renderTable = () => {
		if (loading) {
			return Loader()
		} else {
			return (
				<table className='centered'>
					<thead>
					<tr>
						<th className='cursor-pointer'
						    onClick={() => {
							    setIncrease((prevIncrease) => !prevIncrease)
							    sortCars('mark')
							    setSortIcon('mark')
						    }}>
							Марка и модель
							{sortIcon === 'mark' ?
								increase ? <i className="material-icons vertical-align">arrow_drop_down</i>
									: <i className="material-icons vertical-align">arrow_drop_up</i>
								: null
							}
						</th>
						{tariffs.map((item, index) => {
							return (
								<th
									key={index}
									className='cursor-pointer'
									onClick={() => {
										setIncrease(prevState => !prevState)
										sortCars(item)
										setSortIcon(item)
									}}
								>
									{item}
									{sortIcon === item ?
										increase ? <i className="material-icons vertical-align">arrow_drop_down</i>
											: <i className="material-icons vertical-align">arrow_drop_up</i>
										: null
									}
								</th>
							)
						})}
					</tr>
					</thead>

					<tbody>
					{cars.map((item, index) => {
						return (
							<tr
								key={index}
								onClick={() => setCurrentCar(item)}
								className='modal-trigger'
								data-target="currentCar"
							>
								<td>{`${item.mark} ${item.model}`}</td>
								<td>{item.tariffs.Стандарт ? item.tariffs.Стандарт.year : '-'}</td>
								<td>{item.tariffs.Комфорт ? item.tariffs.Комфорт.year : '-'}</td>
								<td>{item.tariffs.Бизнес ? item.tariffs.Бизнес.year : '-'}</td>
								<td>{item.tariffs['Комфорт+'] ? item.tariffs['Комфорт+'].year : '-'}</td>
								<td>{item.tariffs.Эконом ? item.tariffs.Эконом.year : '-'}</td>
								<td>{item.tariffs.Минивен ? item.tariffs.Минивен.year : '-'}</td>
								<td>{item.tariffs.Лайт ? item.tariffs.Лайт.year : '-'}</td>
							</tr>
						)
					})}
					</tbody>
				</table>
			)

		}
	}

	const search = () => {
		if (textSearch) {
			let regExp = new RegExp(textSearch, 'ig')
			let updateCars = defaultCars.filter(item => {
				let all = item.mark + ' ' + item.model
				for (let i = 0; i < Object.keys(item.tariffs).length; i++) {
					all += ' ' + item.tariffs[Object.keys(item.tariffs)[i]].year
					if (all.match(regExp)) {
						return item
					}
					all = item.mark + ' ' + item.model
				}
				all = ''
			})
			setCars(updateCars)
		} else {
			setCars(defaultCars)
		}
	}

	return (
		<>
			<header>
				<nav>
					<div className="nav-wrapper padding-left purple">
						<span className="brand-logo cursor-pointer">Ситимобил</span>
						<span data-target="slide-out" className="sidenav-trigger"><i
							className="material-icons cursor-pointer">menu</i></span>
					</div>
				</nav>
				<ul id="slide-out" className="sidenav sidenav-fixed">
					<li className='padding-left'>Пункт 1</li>
					<li className='padding-left'>Пункт 2</li>
					<li className='padding-left'>Пункт 3</li>
				</ul>
			</header>

			<main className='margin-custom'>
				<div className="row">
					<div className="input-field col s10">
						<i className="material-icons prefix">search</i>
						<input
							id="search"
							type="text"
							onChange={(event) => setTextSearch(event.target.value)}
						/>
						<label htmlFor="search">Поиск</label>
					</div>
					<div className="input-field col s1">
						<button
							className="btn waves-effect waves-light purple"
							onClick={search}
						>
							Поиск
						</button>
					</div>
				</div>
				{renderTable()}
			</main>

			<footer className="page-footer purple">
				<div className="container">
					<div className="row">
						<div className="col l6 s12">
							<h5 className="white-text">Footer Content</h5>
						</div>
						<div className="col l4 offset-l2 s12">
							<h5 className="white-text">Links</h5>
						</div>
					</div>
				</div>
				<div className="footer-copyright">
					<div className="container">
						© 2021 Copyright Text
					</div>
				</div>
			</footer>

			<div id="currentCar" className="modal">
				<p className='padding-left'>
					{currentCar ? `${currentCar.mark} ${currentCar.model} ${currentCar.tariffs[Object.keys(currentCar.tariffs)[0]].year} года выпуска` : null}
				</p>
				<div className="modal-footer">
					<button className="btn modal-close purple">Закрыть</button>
				</div>
			</div>
		</>
	);
}

export default App;