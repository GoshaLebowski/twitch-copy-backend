import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

import { IS_DEV_ENV } from './is-dev.util'

import DeviceDetector = require('device-detector-js')

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

export function getSessionMetaData(
    req: Request,
    userAgent: string
): SessionMetadata {
    const ip = IS_DEV_ENV
        ? '173.166.164.121'
        : Array.isArray(req.headers['cf-connecting-ip'])
          ? req.headers['cf-connecting-ip'][0]
          : req.headers['cf-connecting-ip'] ||
            (typeof req.headers['x-forwarded-for'] === 'string'
                ? req.headers['x-forwarded-for'].split(',')[0]
                : req.ip || '127.0.0.1')

    const location = lookup(ip)
    const device = new DeviceDetector().parse(userAgent)

    return {
        location: {
            country: countries.getName(location.country, 'en') || 'Неизвестно',
            city: location?.city || 'Неизвестно',
            latitude: location?.ll?.[0] || 0,
            longitude: location?.ll?.[1] || 0
        },
        device: {
            browser: device.client?.name || 'Неизвестно',
            os: device.os?.name || 'Неизвестно',
            type: device.device?.type || 'Неизвестно'
        },
        ip
    }
}
