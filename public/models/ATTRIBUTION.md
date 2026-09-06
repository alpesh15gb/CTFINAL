# Asset Attribution

## Jaguar XE SV Project 8 (current hero vehicle)

- Local asset: `public/models/jaguar.glb`
- Apparent title: Jaguar XE SV Project 8 (from embedded material names)
- Source: user-provided file; original download source and license unknown
- Changes for the design visualization: runtime body finish
  (`Paint_Material1`, `color_2`, `Coloured_Material1`), glass materials,
  lighting, and scene composition. `public/images/hero-jaguar.webp` is a
  rendered derivative of this model, used as the loading and static fallback.

Confirm you hold the rights to publish this model before production use.
No Jaguar endorsement, sponsorship, or affiliation is implied.

## Ferrari 458 Italia (previous hero vehicle, retained in repo)

- Local asset: `public/models/ferrari-458.glb`
- Title: Ferrari 458 Italia
- Creator: vicent091036
- License: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- Original listing: https://sketchfab.com/3d-models/ferrari-458-italia-57bf6cc56931426e87494f554df1dab6
- Download source: https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb
- Attribution source: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_car.html
- License audit: https://github.com/mrdoob/three.js/issues/23089#issuecomment-1001258942

The original Sketchfab listing is disabled and cannot currently be used to
independently verify its license. The creator attribution is retained from the
three.js car example, and the three.js license audit records this model as
CC BY 4.0.

Changes for the design visualization: runtime body finish, rim/glass materials,
lighting, and scene composition. These describe runtime presentation changes,
not edits to the downloaded model binary. `public/images/hero-ferrari.webp` is
a rendered derivative of this model, used as the loading and static fallback.

The model is shown for design visualization only. No Ferrari endorsement,
sponsorship, or affiliation is implied.

## Studio Small 03 Environment

- Existing local asset: `public/env/studio_small_03_1k.hdr`
- Title: Studio Small 03
- Provider: Poly Haven
- Source: https://polyhaven.com/a/studio_small_03
- License: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)
- Changes in this asset addition: none; the existing HDR file is preserved.

## Draco Decoders

- Local assets: `public/draco/draco_wasm_wrapper.js`, `public/draco/draco_decoder.wasm`, and `public/draco/draco_decoder.js`
- Project: Google Draco
- Distribution: three.js r167, glTF decoder builds for use with r167 GLTFLoader/DRACOLoader
- Source directory: https://github.com/mrdoob/three.js/tree/r167/examples/jsm/libs/draco/gltf
- Download base: https://raw.githubusercontent.com/mrdoob/three.js/r167/examples/jsm/libs/draco/gltf/
- License: Apache License 2.0; local copy at `public/draco/LICENSE`
- Upstream license reference: https://github.com/mrdoob/three.js/blob/r167/examples/jsm/libs/draco/README.md
- License download source: https://raw.githubusercontent.com/google/draco/master/LICENSE
- Changes: none; decoder files are self-hosted unchanged.

The r167 glTF decoder directory and its parent do not contain a separate license
file. The parent README identifies Apache License 2.0 and links to the Google
Draco license copied here.
