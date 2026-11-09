// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 AI Power Grid

import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

type PageProps = { params: Promise<{ mdxPath?: string[] }> }

export const generateStaticParams = generateStaticParamsFor('mdxPath')
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps) {
  const { mdxPath } = await params
  const { metadata } = await importPage(mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: Content, toc, metadata, sourceCode } = await importPage(params.mdxPath)
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <Content {...props} params={params} />
    </Wrapper>
  )
}
