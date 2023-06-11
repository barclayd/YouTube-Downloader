/* eslint-disable object-curly-newline */
/* eslint-disable arrow-parens */
import cors from 'cors';
import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import express from 'express';
import Ffmpeg from 'fluent-ffmpeg';

const app = express();

app.use(cors('*'));

app.get('/check-download', async (req, res, next) => {
  try {
    const { URL } = req.query;
    const {
      player_response: {
        videoDetails: { title, author },
      },
    } = await ytdl.getBasicInfo(URL);
    res.json({
      status: true,
      title,
      author,
    });
    next();
  } catch (e) {
    console.log(e);
  }
});

app.get('/search', async (req, res, next) => {
  try {
    const payload = {
      context: {
        client: {
          hl: 'tr',
          gl: 'TR',
          remoteHost: '37.154.158.51',
          deviceMake: 'Apple',
          deviceModel: '',
          visitorData: 'CgtMNktYRWJ0cmY2MCjBy7KZBg%3D%3D',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36,gzip(gfe)',
          clientName: 'WEB',
          clientVersion: '2.20220921.08.00',
          osName: 'Macintosh',
          osVersion: '10_15_7',
          originalUrl: 'https://www.youtube.com/results?search_query=bi+tek+ben+anlar%C4%B1m',
          platform: 'DESKTOP',
          clientFormFactor: 'UNKNOWN_FORM_FACTOR',
          configInfo: { appInstallData: 'CMHLspkGELiLrgUQy-z9EhCZxq4FEJOvrgUQ4rmuBRDqyq4FENSDrgUQzYX-EhC-xK4FELfLrQUQt8iuBRD8hv4SEJH4_BIQ2L6tBQ%3D%3D' },
          userInterfaceTheme: 'USER_INTERFACE_THEME_DARK',
          timeZone: 'Europe/Istanbul',
          browserName: 'Chrome',
          browserVersion: '105.0.0.0',
          screenWidthPoints: 1920,
          screenHeightPoints: 976,
          screenPixelDensity: 1,
          screenDensityFloat: 1,
          utcOffsetMinutes: 180,
          memoryTotalKbytes: '8000000',
          mainAppWebInfo: {
            graftUrl: '/results?search_query=bi+tek+ben+anlar%C4%B1m',
            pwaInstallabilityStatus: 'PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED',
            webDisplayMode: 'WEB_DISPLAY_MODE_BROWSER',
            isWebNativeShareAvailable: false,
          },
        },
        user: { lockedSafetyMode: false },
        request: { useSsl: true, internalExperimentFlags: [], consistencyTokenJars: [] },
        clickTracking: { clickTrackingParams: 'CBYQ7VAiEwit2syDgan6AhUuyxEIHWTwDmA=' },
        adSignalsInfo: {
          params: [
            { key: 'dt', value: '1663870402061' },
            { key: 'flash', value: '0' },
            { key: 'frm', value: '0' },
            { key: 'u_tz', value: '180' },
            { key: 'u_his', value: '5' },
            { key: 'u_h', value: '1080' },
            { key: 'u_w', value: '1920' },
            { key: 'u_ah', value: '1055' },
            { key: 'u_aw', value: '1920' },
            { key: 'u_cd', value: '24' },
            { key: 'bc', value: '31' },
            { key: 'bih', value: '976' },
            { key: 'biw', value: '1905' },
            { key: 'brdim', value: '-120,-1055,-120,-1055,1920,-1055,1920,1055,1920,976' },
            { key: 'vis', value: '1' },
            { key: 'wgl', value: 'true' },
            { key: 'ca_type', value: 'image' },
          ],
          bid: 'ANyPxKpOfAcMptyxQJT0TJeegSBiN9oQdgg_2KaqyB1LVChjxQhDvxpQRZ9vbLXYoM4-saMxpK1NTTKE7v7hXIWQ_ri4lb595g',
        },
      },
      query: req.query.query,
      webSearchboxStatsUrl:
        '/search?oq=bi tek ben anlarim&gs_l=youtube.12...0.0.2.15342.0.0.0.0.0.0.0.0..0.0.qsslwc,ytpo-bo-me=0,ytposo-bo-me=0,ytpo-bo-ei=45358230,ytposo-bo-ei=45358230,cfro=1,ytpo-bo-me=1,ytposo-bo-me=1,ytpo-bo-ei=45379428,ytposo-bo-ei=45379428.1..0...1ac..64.youtube..0.0.0....0.FxzHpXryUjg',
    };

    const searchResponse = await fetch('https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const searchData = await searchResponse.json();

    res.json(searchData);
    next();
  } catch (e) {
    console.log(e);
  }
});

app.get('/download', async (req, res) => {
  try {
    const { URL, downloadFormat, quality, title } = req.query;
    if (downloadFormat === 'audioonly') {
      res.setHeader('Content-Disposition', `attachment; filename=${title.substring(0, 40)}.mp3`);
      const stream = ytdl(URL, {
        filter: (format) => {
          console.log(JSON.stringify(format));
          return format.container === 'webm' && format.hasAudio && !format.hasVideo;
        },
      });
      const proc = new Ffmpeg({ source: stream });
      proc.setFfmpegPath('/usr/bin/ffmpeg');
      proc.withAudioCodec('libmp3lame').toFormat('mp3').output(res).run();
    } else {
      res.header('Content-Disposition', `attachment; filename="${title.substring(0, 25)}.mp4"`);
      ytdl(URL, {
        filter: downloadFormat,
        quality,
        // format: downloadFormat,
      }).pipe(res);
    }
  } catch (e) {
    console.log(e);
  }
});

// eslint-disable-next-line no-console
app.listen({ port: 8000 }, () => console.log('🚀 Server ready at http://localhost:8000'));
