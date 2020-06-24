<template>
  <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 44 0 0 1 10 50" transform="rotate(53.8517 50 52)">
    <!-- disabling eslint is needed because renamed camelCasedAttr to hyphenated-attr due to which the attributes are no longer valid-->
    <!-- eslint-disable -->
        <animateTransform
            type="rotate"
            values="0 50 52;360 50 52"
            begin="0s"
            dur="1s"
            attributeName="transform"
            calcMode="linear"
            keyTimes="0;1"
            repeatCount="indefinite"
        ></animateTransform>
    </path>
</template>
