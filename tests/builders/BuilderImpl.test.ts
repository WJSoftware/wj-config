import { describe, it, expect, vi } from 'vitest';
import { BuilderImpl } from '../../src/builders/BuilderImpl.js';
import { ObjectDataSource } from '../../src/dataSources/ObjectDataSource.js';

describe('BuilderImpl', () => {
    describe('build', () => {
        it("Should merge all data sources together.", async () => {
            // Arrange.
            const dataSources = [
                { id1: 'a', value1: 'value-a' },
                { id2: 'b', value2: 'value-b' },
                { id3: 'c', value3: 'value-c' },
            ];
            const builder = new BuilderImpl();
            dataSources.forEach(ds => builder.add(new ObjectDataSource(ds)));

            // Act.
            const result = await builder.build(false, () => false);

            // Assert.
            expect(result).toEqual({
                id1: 'a',
                value1: 'value-a',
                id2: 'b',
                value2: 'value-b',
                id3: 'c',
                value3: 'value-c'
            });
        });
        it("Should run every post-merge function in the correct order.", async () => {
            // Arrange.
            const builder = new BuilderImpl();
            const spyCount = vi.fn();
            builder.postMerge(config => {
                spyCount(config);
                expect(spyCount).toHaveBeenCalledTimes(1);
                return { ...config, additional: "value" };
            });
            builder.postMerge(config => {
                spyCount(config);
                expect(spyCount).toHaveBeenCalledTimes(2);
                return { ...config, test: "test" };
            });
            builder.postMerge(config => {
                spyCount(config);
                expect(spyCount).toHaveBeenCalledTimes(3);
                return { ...config, additional: "value modified" };
            });

            // Act.
            const result = await builder.build(false, () => false);

            // Assert.
            expect(result).toEqual({
                additional: 'value modified',
                test: 'test'
            });
        });
        it("Should trigger URL-building function creation when required.", async () => {
            // Arrange.
            const builder = new BuilderImpl();
            builder.add(new ObjectDataSource({
                api: {
                    rootPath: '/',
                }
            }));
            builder.createUrlFunctions('api');

            // Act.
            const result = await builder.build(false, () => false);

            // Assert.
            expect(typeof result.api.buildUrl).toBe('function');
        });
        it("Should add tracing data when requested.", async () => {
            // Arrange.
            const builder = new BuilderImpl();
            const dataSource = new ObjectDataSource({
                api: {
                    rootPath: '/',
                }
            });
            builder.add(dataSource);

            // Act.
            const result = await builder.build(true, () => false);

            // Assert.
            expect(result._qualifiedDs).to.be.an('array');
            expect(result._trace).to.be.an('object');
        });
    });
});
