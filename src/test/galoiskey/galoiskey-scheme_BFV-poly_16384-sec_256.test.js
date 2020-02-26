describe('galoiskey on BFV', () => {
  describe('polyModulusDegree 16384', () => {
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const schemeType = Morfix.SchemeType.BFV
      const securityLevel = Morfix.SecurityLevel.tc256
      const polyModulusDegree = 16384
      const bitSizes = [47,47,47,48,48]
      const bitSize = 20
      
      const parms = Morfix.EncryptionParameters(schemeType)

      parms.setPolyModulusDegree(polyModulusDegree)
      
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus(
        Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)) 
      )

      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus(
        Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
      )

      const context = Morfix.Context(
        parms,
        true,
        securityLevel
      )

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator(context)

      const spyGenGaloisKeys = jest.spyOn(keyGenerator, 'genGaloisKeys')
      const galoisKeys = keyGenerator.genGaloisKeys()
      expect(spyGenGaloisKeys).toHaveBeenCalled()

      const spySaveGaloisKeys = jest.spyOn(galoisKeys, 'save')
      const base64 = galoisKeys.save()
      expect(spySaveGaloisKeys).toHaveBeenCalled()

      const spyLoadGaloisKeys = jest.spyOn(galoisKeys, 'load')
      galoisKeys.load(context, base64)
      expect(spyLoadGaloisKeys).toHaveBeenCalled()
    })
  })
})
