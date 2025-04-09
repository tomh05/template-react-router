import { Player, PlayerRef } from "@remotion/player";
import { useMemo, useState } from "react";
import {
    DURATION_IN_FRAMES,
    COMPOSITION_FPS,
    COMPOSITION_HEIGHT,
    COMPOSITION_WIDTH,
} from "./remotion/constants.mjs";
import "./app.css";
import { z } from "zod";
import { Main } from "./remotion/components/Main";
import { RenderControls } from "./components/RenderControls";
import { Spacing } from "./components/Spacing";
import { Tips } from "./components/Tips";
import { CompositionProps } from "./remotion/schemata";
import { CallbackListener } from '@remotion/player';
import { useRef, useEffect } from 'react';

export default function Index() {
    const [text, setText] = useState("React Router + Remotion");

    const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
        return {
            title: text,
        };
    }, [text]);

    const playerRef = useRef<PlayerRef>(null);

    useEffect(() => {
        console.log('playerRef is', playerRef.current);
        if (!playerRef.current) {
            return;
        }
        const onPlay: CallbackListener<'play'> = () => {
            console.log('play');
        };
        const onRateChange: CallbackListener<'ratechange'> = (e) => {
            console.log('ratechange', e.detail.playbackRate);
        };
        const onVolumeChange: CallbackListener<'volumechange'> = (e) => {
            console.log('new volume', e.detail.volume);
        };

        const onPause: CallbackListener<'pause'> = () => {
            console.log('pausing');
        };

        const onSeeked: CallbackListener<'seeked'> = (e) => {
            console.log('seeked to ' + e.detail.frame);
        };

        const onTimeupdate: CallbackListener<'timeupdate'> = (e) => {
            console.log('time has updated to ' + e.detail.frame);
        };

        const onEnded: CallbackListener<'ended'> = () => {
            console.log('ended');
        };

        const onError: CallbackListener<'error'> = (e) => {
            console.log('error', e.detail.error);
        };

        const onFullscreenChange: CallbackListener<'fullscreenchange'> = (e) => {
            console.log('fullscreenchange', e.detail.isFullscreen);
        };

        const onScaleChange: CallbackListener<'scalechange'> = (e) => {
            console.log('scalechange', e.detail.scale);
        };

        const onMuteChange: CallbackListener<'mutechange'> = (e) => {
            console.log('mutechange', e.detail.isMuted);
        };

        playerRef.current.addEventListener('play', onPlay);
        playerRef.current.addEventListener('ratechange', onRateChange);
        playerRef.current.addEventListener('volumechange', onVolumeChange);
        playerRef.current.addEventListener('pause', onPause);
        playerRef.current.addEventListener('ended', onEnded);
        playerRef.current.addEventListener('error', onError);
        playerRef.current.addEventListener('fullscreenchange', onFullscreenChange);
        playerRef.current.addEventListener('scalechange', onScaleChange);
        playerRef.current.addEventListener('mutechange', onMuteChange);

        // See below for difference between `seeked` and `timeupdate`
        playerRef.current.addEventListener('seeked', onSeeked);
        playerRef.current.addEventListener('timeupdate', onTimeupdate);

        return () => {
            // Make sure to clean up event listeners
            if (playerRef.current) {
                playerRef.current.removeEventListener('play', onPlay);
                playerRef.current.removeEventListener('ratechange', onRateChange);
                playerRef.current.removeEventListener('volumechange', onVolumeChange);
                playerRef.current.removeEventListener('pause', onPause);
                playerRef.current.removeEventListener('ended', onEnded);
                playerRef.current.removeEventListener('error', onError);
                playerRef.current.removeEventListener('fullscreenchange', onFullscreenChange);
                playerRef.current.removeEventListener('scalechange', onScaleChange);
                playerRef.current.removeEventListener('mutechange', onMuteChange);
                playerRef.current.removeEventListener('seeked', onSeeked);
                playerRef.current.removeEventListener('timeupdate', onTimeupdate);
            }
        };
    }, []);

    return (
        <div>
            <div className="max-w-screen-md m-auto mb-5">
                <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
                    <Player
                        component={Main}
                        inputProps={inputProps}
                        durationInFrames={DURATION_IN_FRAMES}
                        fps={COMPOSITION_FPS}
                        compositionHeight={COMPOSITION_HEIGHT}
                        compositionWidth={COMPOSITION_WIDTH}
                        style={{
                            // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
                            // but not over inline styles
                            width: "100%",
                        }}
                        controls
                        autoPlay
                        loop
                    />
                </div>
                <RenderControls
                    text={text}
                    setText={setText}
                    inputProps={inputProps}
                ></RenderControls>
                <Spacing></Spacing>
                <Spacing></Spacing>
                <Spacing></Spacing>
                <Spacing></Spacing>
                <Tips></Tips>
            </div>
        </div>
    );
}
