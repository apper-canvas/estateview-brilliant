import Browse from '@/components/pages/Browse';
import MapView from '@/components/pages/MapView';
import SavedProperties from '@/components/pages/SavedProperties';
import PropertyDetail from '@/components/pages/PropertyDetail';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/',
    icon: 'Home',
    component: Browse
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  savedProperties: {
    id: 'savedProperties',
    label: 'Saved Properties',
    path: '/saved',
    icon: 'Heart',
    component: SavedProperties
  },
  propertyDetail: {
    id: 'propertyDetail',
    label: 'Property Detail',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetail,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;