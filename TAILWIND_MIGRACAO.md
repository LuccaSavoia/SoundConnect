# Migração para Tailwind

Os estilos de layout e componentes foram transferidos de `src/index.css` para os atributos `className` de cada componente JSX. O arquivo CSS agora contém apenas as diretivas do Tailwind.

Foram usadas utilities nativas e valores arbitrários de Tailwind para preservar as dimensões, gradientes e efeitos anteriores. Os estados hover, foco e breakpoints foram convertidos em variantes Tailwind.
