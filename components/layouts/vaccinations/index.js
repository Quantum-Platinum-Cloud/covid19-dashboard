import React, {useState, useContext, useEffect} from 'react'
import {FileText, Map, BarChart2} from 'react-feather'
import {keyBy} from 'lodash'

import theme from '../../../styles/theme'
import colors from '../../../styles/colors'

import {AppContext, ThemeContext} from '../../../pages'

import Scrollable from '../../scrollable'

import VaccinationsMaps from './vaccinations-maps'

import VaccinationsInformations from './vaccinations-informations'
import VaccinationsStatistics from './vaccinations-statistics'
import TerritoriesMobileMap from '../../territories-mobile-map'
import TerritoriesDesktopMap from '../../territories-desktop-map'

export const VaccinationsContext = React.createContext()

const MobileVaccinations = () => {
  const [selectedView, setSelectedView] = useState('stats')

  const app = useContext(AppContext)
  const theme = useContext(ThemeContext)

  const views = {
    map: (
      <TerritoriesMobileMap maps={VaccinationsMaps} context={VaccinationsContext}>
        <VaccinationsStatistics />
      </TerritoriesMobileMap>
    ),
    stats: (
      <Scrollable>
        <VaccinationsStatistics />
      </Scrollable>
    ),
    informations: (
      <Scrollable>
        <VaccinationsInformations />
      </Scrollable>
    )
  }

  const handleClick = view => {
    app.setSelectedLocation('FRA')
    setSelectedView(view)
  }

  return (
    <>
      <Scrollable>
        {views[selectedView]}
      </Scrollable>

      <div className='view-selector'>
        <div className={`${selectedView === 'stats' ? 'selected' : ''}`} onClick={() => handleClick('stats')}>
          <BarChart2 size={32} color={selectedView === 'stats' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'map' ? 'selected' : ''}`} onClick={() => handleClick('map')}>
          <Map size={32} color={selectedView === 'map' ? theme.primary : colors.black} />
        </div>
        <div className={`${selectedView === 'informations' ? 'selected' : ''}`} onClick={() => handleClick('informations')}>
          <FileText size={32} color={selectedView === 'informations' ? theme.primary : colors.black} />
        </div>
      </div>

      <style jsx>{`
        .view-selector {
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          box-shadow: 0 -1px 4px ${colors.lightGrey};
        }

        .view-selector > div {
          padding: 0.5em;
          margin: auto;
          margin-bottom: -4px;
        }

        .view-selector > div.selected {
          border-top: 4px solid ${theme.primary};
        }
      `}</style>
    </>
  )
}

const DesktopVaccinations = () => {
  return (
    <>
      <div className='menu'>
        <Scrollable>
          <>
            <VaccinationsStatistics />
            <VaccinationsInformations />
          </>
        </Scrollable>
      </div>

      <div className='map'>
        <TerritoriesDesktopMap maps={VaccinationsMaps} context={VaccinationsContext} />
      </div>

      <style jsx>{`
        .menu {
          z-index: 1;
          display: flex;
          flex-direction: column;
          max-width: ${theme.menuWidth};
          box-shadow: 0 1px 4px ${colors.lightGrey};
        }

        .map {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
        }
      `}</style>
    </>
  )
}

const Vaccinations = props => {
  const {isMobileDevice} = useContext(AppContext)

  const [selectedMapId, setSelectedMapId] = useState('Nombre de premières injections réalisées')
  const [selectedStat, setSelectedStat] = useState(null)

  const Component = isMobileDevice ? MobileVaccinations : DesktopVaccinations

  useEffect(() => {
    const mapProperties = keyBy(VaccinationsMaps, 'property')

    if (mapProperties[selectedStat]) {
      setSelectedMapId(mapProperties[selectedStat].name)
    } else if (selectedStat === 'mixed') {
      setSelectedMapId(mapProperties.hospitalises.name)
    }
  }, [selectedStat])

  return (
    <VaccinationsContext.Provider value={{selectedMapId, setSelectedMapId, selectedStat, setSelectedStat}}>
      <Component {...props} />
    </VaccinationsContext.Provider>
  )
}

export default Vaccinations