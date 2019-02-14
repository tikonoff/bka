import PhoneCaseRepository from '../repos/PhoneCaseRepository'
import TShirtRepository from '../repos/TShirtRepository'
import LawnmowerRepository from '../repos/LawnmowerRepository'

const R = require('ramda')

const lawnmowers = new LawnmowerRepository()
const phoneCases = new PhoneCaseRepository()
const tShirts = new TShirtRepository()

const repos = [
  { name: lawnmowers, type: 'Lawnmowers' },
  { name: phoneCases, type: 'Phone cases' },
  { name: tShirts, type: 'T-Shirts' }
]

const readRepo = (repo) =>
  new Promise((resolve) =>
    setTimeout(() =>
      resolve(repo.getAll()), 3000
    )
  )

const getData = () => Promise.all(
  repos.map(async (repo) => ({ data: await readRepo(repo.name), type: repo.type})))

const toFixed = number => number.toFixed(2)
const exchange = rate => R.compose(toFixed, R.multiply(rate))
const currency = rate => R.map(R.over(R.lensProp('price'), exchange(rate)))
const pick = R.map(R.pick(['id','name','price']))
const addType = type => R.map(R.assoc('type', type))
const transform = (rate, type) => R.compose(addType(type), currency(rate), pick)

// const consolidate = async (rate = 1) => repos.map(repo => (transform(rate, repo.type)(repo.data)))

const consolidate = async (rate = 1) => {
  const data = await getData()
  return data.map(repo => transform(rate, repo.type)(repo.data))
}

export { transform }
export default consolidate


