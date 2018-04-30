//========= Copyright � 1996-2008, Valve LLC, All rights reserved. ============
//
// Purpose: Class for rendering photon beams
//
// $NoKeywords: $
//=============================================================================

#include "stdafx.h"
#include "PhotonBeam.h"
#include "SpaceWar.h"

//-----------------------------------------------------------------------------
// Purpose: Constructor
//-----------------------------------------------------------------------------
CPhotonBeam::CPhotonBeam( IGameEngine *pGameEngine, float xPos, float yPos, DWORD dwBeamColor, float flInitialRotation, float flInitialXspeed, float flInitialYspeed )
	: CSpaceWarEntity( pGameEngine, 3, true )
{
	// Beams only have a lifetime of 1 second
	m_ulTickCountToDieAt = m_pGameEngine->GetGameTickCount()+PHOTON_BEAM_LIFETIME_IN_TICKS;

	// Set a really high max speed for photon beams
	SetMaximumspeed( 500 );

	AddLine( -2.0f, -3.0f, -2.0f, 3.0f, dwBeamColor );
	AddLine( 2.0f, -3.0f, 2.0f, 3.0f, dwBeamColor );
	SetPosition( xPos, yPos );
	SetRotationDeltaNextFrame( flInitialRotation );
	Setspeed( flInitialXspeed, flInitialYspeed );
}


//-----------------------------------------------------------------------------
// Purpose: Update with data from server
//-----------------------------------------------------------------------------
void CPhotonBeam::OnReceiveServerUpdate( ServerPhotonBeamUpdateData_t *pUpdateData )
{
	SetPosition( pUpdateData->GetXPosition()*m_pGameEngine->GetViewportWidth(), pUpdateData->GetYPosition()*m_pGameEngine->GetViewportHeight() );
	Setspeed( pUpdateData->GetXspeed(), pUpdateData->GetYspeed() );
	SetAccumulatedRotation( pUpdateData->GetRotation() );
}