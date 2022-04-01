// import {SettingsSdkKeys} from '../../models/settings'

const DEFAULT_META_TAG = 'width=device-width, initial-scale=1.0, maximum-scale=5.0'
const FORCE_DESKTOP_META_TAG = 'width=976'
const FORCE_DESKTOP_META_TAG_LARGE_DEVICE = 'width=976, initial-scale=1.0'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getForceDesktopLayout = (configuration: any) => {
  //   if (!configuration) {
  //     throw new Error('Settings Failure')
  //   }
  //   if (configuration[SettingsSdkKeys.ForceDesktopLayout]?.Value) {
  //     return configuration[SettingsSdkKeys.ForceDesktopLayout].Value
  //   }
  return false
}

export const getViewportMetaTag = (configuration: any) => {
  try {
    if (getForceDesktopLayout(configuration)) {
      return FORCE_DESKTOP_META_TAG
    }
    return DEFAULT_META_TAG
  } catch {
    return DEFAULT_META_TAG
  }
}

export const getViewportMetaTagScript = (configuration: any) => {
  try {
    if (getForceDesktopLayout(configuration)) {
      return `<script type="text/javascript">
            if (screen.width >= 976) {
                viewport = document.querySelector("meta[name=viewport]");
                viewport.setAttribute('content', '${FORCE_DESKTOP_META_TAG_LARGE_DEVICE}');
            }
            </script>`
    }
    return ''
  } catch {
    return ''
  }
}
