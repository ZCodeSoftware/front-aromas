import { useState } from 'react';
import type { IProfileLocationsView } from './types/locations-view';
import ProfileLocationsView from './components/Profile-Locations-View';
import ProfileCreateLocation from './components/Profile-Create-Location';
import ProfileUpdateLocation from './components/Profile-Update-Location';
const ProfileLocations = () => {
	const [currentView, setCurrentView] =
		useState<IProfileLocationsView>('locations');
	const [exitingView, setExitingView] =
		useState<IProfileLocationsView | null>(null);

	const navigateTo = (view: IProfileLocationsView) => {
		if (view === currentView) return;

		setExitingView(currentView);
		setCurrentView(view);

		setTimeout(() => {
			setExitingView(null);
		}, 300);
	};

	const renderView = (view: IProfileLocationsView, isExiting: boolean) => {
		const isNavigatingForward =
			currentView !== 'locations' &&
			(exitingView === 'locations' || !exitingView);
		const isNavigatingBackward =
			currentView === 'locations' && exitingView !== 'locations';

		let animationClass = '';
		if (isExiting) {
			animationClass = isNavigatingForward
				? 'animate-slide-out-to-left'
				: 'animate-slide-out-to-right';
		} else {
			animationClass = isNavigatingForward
				? 'animate-slide-in-from-right'
				: isNavigatingBackward
				? 'animate-slide-in-from-left'
				: '';
		}

		const componentToRender = () => {
			switch (view) {
				case 'createLocation':
					return <ProfileCreateLocation onNavigate={navigateTo} />;
				case 'updateLocation':
					return <ProfileUpdateLocation onNavigate={navigateTo} />;
				default:
					return <ProfileLocationsView onNavigate={navigateTo} />;
			}
		};

		return (
			<div
				className={`absolute w-full h-full bg-white ${animationClass}`}>
				{componentToRender()}
			</div>
		);
	};

	return (
		<div className='relative flex-1'>
			{renderView(currentView, false)}

			{exitingView && renderView(exitingView, true)}
		</div>
	);
};

export default ProfileLocations;
