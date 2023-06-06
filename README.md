# kiriDevs/vplanweb

> **07.06.2023 - Archived:** I am no longer in school (yaay!). Therefore, I do
> not use this web app anymore and can not access data anymore, meaning I
> neither can nor or want to continue to support this web app.

`vplanweb` is a web app written in TypeScript with `react`, built with `vite`,
that uses information from [@ChuangSheep](https://github.com/ChuangSheep)'s
API to display the substitution plan of my school in a more comprehensive and
interactive way.

## Intention

I was personally frustrated with the substitution table distributed by our
school. It was only available in school spaces (first a dedicated school
platform, later Microsoft Teams), meaning it took a minute or two to find the
file and check it every time. I wanted to create an easy-to-access interface
that also allowed me to extract all needed information at a quick glance.

I solved this by creating a web-app, which - via home screen bookmark - can be
accesses with just a tap on any of my devices. It instantly loads in all needed
information for the current day, so I do not have to search through file
folders or chats.

This project is my first real project for both `react` *and* `typescript`.
However, it also allowed me to expand my knowledge to more areas over time,
since I added more features as the project moved along. The two most important
steps were setting up `vite` (switching from `create-react-app`), and adding
internationalization with `react-i18next`.

## Features

- **Intuitive design** *Well, at least more intuitive than the table the school
  gives out...* The table does not hide any information from the user, but
  highlights entries that are relevant for quick glances. It can be filtered,
  if desired.
- **Mobile View** On mobile (narrow, portrait aspect ratio) devices, the table
  displaying the substitutions will turn into a list view. Common special
  signifiers ("-" for dropped classes, "EVA" for independant working) are
  translated into a comprehensive sentence. The entries are grouped into periods
  of the school day to allow further control of what information to display.
  Relevant entries are still highlighted in blue.
- **Filtering by relevance** `vplanweb` allows the user to specify their year
  (class) and the specific courses they attend. This allows filtering of entries
  in order to only display information that actually affects the user.
- **Internationalization (I18N)** Using `react-i18next`, `vplanweb` supports
  both English and German. The 
- **Persistence** User settings are saved to and retrieved from the browsers
  localstorage. This includes API authentication, user language, and both filter
  settings (user's class and courses) and state (which filter was last enabled).
- **Migration** When changes to the localstorage schema are required (or just
  make sense), the app migrates older versions over to prevent the user effort
  of re-entering their settings after an update

