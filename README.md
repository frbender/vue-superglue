# vue-uberglue

## Project setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Naming

The lib is named uberglue (or vue-uberglue) but the directive is called `sticky` to be consistent with other sticky
element libraries.

### Usage

1. Add uberglue to your app
   ```js
   import 'uberglue' from 'vue-uberglue'
   
   Vue.use(uberglue)
   ```
2. Add the sticky directive to the element which should be sticky and add a `sticky-container` html attribute to the
   element which should determine the top/bottom boundaries.
   ```html
   <div sticky-container>
     <div class="some-other-container some-width">
       <div class="some-width" v-sticky>
         <p>I'm sticky!</p>
       </div>
     </div>
   </div>
   ```
3. Make sure that the sticky element can become `position: absolute` or `position: fixed` without breaking the layout.
   This can often be done by assigning the direct parent and the sicky element the same fixed width:
   ```css
   .some-width {
     width: 300px;
   }
   ```
4. Done!

### Implementation Background

What does uberglue do? It makes the sticky element `position: absolute` or `position: fixed` depending on where the
scroll bar is. It also inserts a placeholder element with the same `clientRect` dimensions directly after the
sticky element so the resulting 'hole' is filled.

For this to work make sure you assign the right `z-index` to the sticky element and 