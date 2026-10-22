# CubeFlow

[Русский](README.md) · English

A Russian / English speedcubing practice site by Emir: all 21 PLL cases, three algorithms per case, 3D move-by-move playback, and a timer for a real cube.

## Try it

Open `index.html` in a browser, keeping `assets/` next to it. There are no runtime dependencies, external scripts or CDN fonts. Choose **RU / EN** in the header. Your language choice is remembered on this device; changing languages preserves the selected algorithm, playback position, favourites and solve history.

The site also provides a single-file offline version. Generate it with:

```sh
node scripts/export.mjs
```

Open `dist/CubeFlow_Preview.html` after export.

## Features

- 21 PLL cases, 63 verified algorithms, searchable categories and learned-case markers.
- Interactive 3D player and individual mini animations: pause, step, scrub, change speed and drag to rotate the view.
- Favourite algorithms, recognition tips and a guide, in Russian and English.
- PLL practice with setups generated from your chosen algorithm and random AUF; selected cases appear in shuffled cycles.
- Full 3×3 practice with 20-move random-move scrambles.
- Hold Space for 0.35 seconds, release to start, press an ordinary key or touch the timer to stop.
- Optional inspection: starting at 15.00 seconds adds +2; at 17.00 seconds, DNF. Esc cancels; losing focus during a solve records DNF.
- Separate statistics for each PLL algorithm and for full 3×3 solves; best time, successful-solve mean, ao5 and ao12.
- Penalty editing, solve details, deletion with undo, CSV export and JSON backup/merge.

Data is stored in this browser's `localStorage`, without accounts or server uploads. Back up your results from **Getting started** before moving devices. Opening a local HTML file and using a hosted site may create separate storage areas.

Animations show face turns, not finger placement. The three alternatives per case are a selection, not an exhaustive list of possible algorithms. Full 3×3 scrambles are intended for practice and do not use an official competition random-state scrambler.

## Develop and deploy

Node.js 20 or newer is required for checks and packaging. No packages need to be installed.

```sh
npm test
npm run build
```

The build copies the static website into `dist/`. Upload the source to a separate repository, then select **Settings → Pages → Source → GitHub Actions**. The included `.github/workflows/pages.yml` tests and deploys pushes to `main` or `master`; you can also run it manually from Actions. If you use a different default branch, update the workflow's branch list.

Alternatively, publish the root directly with **Deploy from a branch → main → /(root)** and disable the custom `Deploy CubeFlow` workflow to avoid duplicate deployments. All asset paths are relative, so repository subpaths work.

See the [official GitHub Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Sources

Cube geometry builds on Emir's original **Cube AI Lab 3D**. The algorithms were cross-checked with [SpeedCubeDB](https://www.speedcubedb.com/a/3x3/PLL); automated tests verify their PLL validity and equivalence within each case. Learning resources link to [J Perm](https://jperm.net/), with inspection rules referenced from the [WCA regulations](https://www.worldcubeassociation.org/regulations/).
