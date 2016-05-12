var _libUtilsJs = require('../lib/utils.js');

'use babel';

describe('utils', function () {
  describe('when uniquifying settings', function () {
    it('should append numbers on equally named settings', function () {
      var settings = [{ name: 'name', cwd: 'cwd1' }, { name: 'name', cwd: 'cwd2' }, { name: 'name', cwd: 'cwd3' }, { name: 'name', cwd: 'cwd4' }];
      expect((0, _libUtilsJs.uniquifySettings)(settings)).toEqual([{ name: 'name', cwd: 'cwd1' }, { name: 'name - 1', cwd: 'cwd2' }, { name: 'name - 2', cwd: 'cwd3' }, { name: 'name - 3', cwd: 'cwd4' }]);
    });

    it('should append numbers on equally named settings, but leave unique names untouched', function () {
      var settings = [{ name: 'name', cwd: 'cwd1' }, { name: 'name', cwd: 'cwd2' }, { name: 'otherName', cwd: 'cwd3' }, { name: 'yetAnotherName', cwd: 'cwd4' }];
      expect((0, _libUtilsJs.uniquifySettings)(settings)).toEqual([{ name: 'name', cwd: 'cwd1' }, { name: 'name - 1', cwd: 'cwd2' }, { name: 'otherName', cwd: 'cwd3' }, { name: 'yetAnotherName', cwd: 'cwd4' }]);
    });
  });

  describe('when getting default settings', function () {
    it('should prioritize specified settings', function () {
      expect((0, _libUtilsJs.getDefaultSettings)('/cwd', { cmd: 'echo hello', cwd: 'relative' })).toEqual({
        cmd: 'echo hello',
        cwd: 'relative',
        args: [],
        env: {},
        sh: true,
        errorMatch: ''
      });
    });

    it('should be possible to override any argument', function () {
      expect((0, _libUtilsJs.getDefaultSettings)('/cwd', {
        cmd: 'echo hello',
        cwd: 'relative',
        args: ['arg1'],
        env: { 'key1': 'val1' },
        sh: false,
        errorMatch: '^regex$'
      })).toEqual({
        cmd: 'echo hello',
        cwd: 'relative',
        args: ['arg1'],
        env: { 'key1': 'val1' },
        sh: false,
        errorMatch: '^regex$'
      });
    });

    it('should take the specifed cwd if omitted from settings', function () {
      expect((0, _libUtilsJs.getDefaultSettings)('/cwd', { cmd: 'make' })).toEqual({
        cmd: 'make',
        cwd: '/cwd',
        args: [],
        env: {},
        sh: true,
        errorMatch: ''
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL3V0aWxzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjBCQUVxRCxpQkFBaUI7O0FBRnRFLFdBQVcsQ0FBQzs7QUFJWixRQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdEIsVUFBUSxDQUFDLDJCQUEyQixFQUFFLFlBQU07QUFDMUMsTUFBRSxDQUFDLGlEQUFpRCxFQUFFLFlBQU07QUFDMUQsVUFBTSxRQUFRLEdBQUcsQ0FDZixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUM3QixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUM3QixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUM3QixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUM5QixDQUFDO0FBQ0YsWUFBTSxDQUFDLGtDQUFpQixRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUN6QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUM3QixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUNqQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUNqQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUNsQyxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLG1GQUFtRixFQUFFLFlBQU07QUFDNUYsVUFBTSxRQUFRLEdBQUcsQ0FDZixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUM3QixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUM3QixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUNsQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQ3hDLENBQUM7QUFDRixZQUFNLENBQUMsa0NBQWlCLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ3pDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQzdCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQ2pDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQ2xDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FDeEMsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQywrQkFBK0IsRUFBRSxZQUFNO0FBQzlDLE1BQUUsQ0FBQyxzQ0FBc0MsRUFBRSxZQUFNO0FBQy9DLFlBQU0sQ0FBQyxvQ0FBbUIsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNqRixXQUFHLEVBQUUsWUFBWTtBQUNqQixXQUFHLEVBQUUsVUFBVTtBQUNmLFlBQUksRUFBRSxFQUFFO0FBQ1IsV0FBRyxFQUFFLEVBQUU7QUFDUCxVQUFFLEVBQUUsSUFBSTtBQUNSLGtCQUFVLEVBQUUsRUFBRTtPQUNmLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsNkNBQTZDLEVBQUUsWUFBTTtBQUN0RCxZQUFNLENBQUMsb0NBQW1CLE1BQU0sRUFBRTtBQUNoQyxXQUFHLEVBQUUsWUFBWTtBQUNqQixXQUFHLEVBQUUsVUFBVTtBQUNmLFlBQUksRUFBRSxDQUFFLE1BQU0sQ0FBRTtBQUNoQixXQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQ3ZCLFVBQUUsRUFBRSxLQUFLO0FBQ1Qsa0JBQVUsRUFBRSxTQUFTO09BQ3RCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNWLFdBQUcsRUFBRSxZQUFZO0FBQ2pCLFdBQUcsRUFBRSxVQUFVO0FBQ2YsWUFBSSxFQUFFLENBQUUsTUFBTSxDQUFFO0FBQ2hCLFdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDdkIsVUFBRSxFQUFFLEtBQUs7QUFDVCxrQkFBVSxFQUFFLFNBQVM7T0FDdEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyx1REFBdUQsRUFBRSxZQUFNO0FBQ2hFLFlBQU0sQ0FBQyxvQ0FBbUIsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDMUQsV0FBRyxFQUFFLE1BQU07QUFDWCxXQUFHLEVBQUUsTUFBTTtBQUNYLFlBQUksRUFBRSxFQUFFO0FBQ1IsV0FBRyxFQUFFLEVBQUU7QUFDUCxVQUFFLEVBQUUsSUFBSTtBQUNSLGtCQUFVLEVBQUUsRUFBRTtPQUNmLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9zYXJnb24vLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy91dGlscy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IHVuaXF1aWZ5U2V0dGluZ3MsIGdldERlZmF1bHRTZXR0aW5ncyB9IGZyb20gJy4uL2xpYi91dGlscy5qcyc7XG5cbmRlc2NyaWJlKCd1dGlscycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3doZW4gdW5pcXVpZnlpbmcgc2V0dGluZ3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBlbmQgbnVtYmVycyBvbiBlcXVhbGx5IG5hbWVkIHNldHRpbmdzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2V0dGluZ3MgPSBbXG4gICAgICAgIHsgbmFtZTogJ25hbWUnLCBjd2Q6ICdjd2QxJyB9LFxuICAgICAgICB7IG5hbWU6ICduYW1lJywgY3dkOiAnY3dkMicgfSxcbiAgICAgICAgeyBuYW1lOiAnbmFtZScsIGN3ZDogJ2N3ZDMnIH0sXG4gICAgICAgIHsgbmFtZTogJ25hbWUnLCBjd2Q6ICdjd2Q0JyB9XG4gICAgICBdO1xuICAgICAgZXhwZWN0KHVuaXF1aWZ5U2V0dGluZ3Moc2V0dGluZ3MpKS50b0VxdWFsKFtcbiAgICAgICAgeyBuYW1lOiAnbmFtZScsIGN3ZDogJ2N3ZDEnIH0sXG4gICAgICAgIHsgbmFtZTogJ25hbWUgLSAxJywgY3dkOiAnY3dkMicgfSxcbiAgICAgICAgeyBuYW1lOiAnbmFtZSAtIDInLCBjd2Q6ICdjd2QzJyB9LFxuICAgICAgICB7IG5hbWU6ICduYW1lIC0gMycsIGN3ZDogJ2N3ZDQnIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhcHBlbmQgbnVtYmVycyBvbiBlcXVhbGx5IG5hbWVkIHNldHRpbmdzLCBidXQgbGVhdmUgdW5pcXVlIG5hbWVzIHVudG91Y2hlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNldHRpbmdzID0gW1xuICAgICAgICB7IG5hbWU6ICduYW1lJywgY3dkOiAnY3dkMScgfSxcbiAgICAgICAgeyBuYW1lOiAnbmFtZScsIGN3ZDogJ2N3ZDInIH0sXG4gICAgICAgIHsgbmFtZTogJ290aGVyTmFtZScsIGN3ZDogJ2N3ZDMnIH0sXG4gICAgICAgIHsgbmFtZTogJ3lldEFub3RoZXJOYW1lJywgY3dkOiAnY3dkNCcgfVxuICAgICAgXTtcbiAgICAgIGV4cGVjdCh1bmlxdWlmeVNldHRpbmdzKHNldHRpbmdzKSkudG9FcXVhbChbXG4gICAgICAgIHsgbmFtZTogJ25hbWUnLCBjd2Q6ICdjd2QxJyB9LFxuICAgICAgICB7IG5hbWU6ICduYW1lIC0gMScsIGN3ZDogJ2N3ZDInIH0sXG4gICAgICAgIHsgbmFtZTogJ290aGVyTmFtZScsIGN3ZDogJ2N3ZDMnIH0sXG4gICAgICAgIHsgbmFtZTogJ3lldEFub3RoZXJOYW1lJywgY3dkOiAnY3dkNCcgfVxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGdldHRpbmcgZGVmYXVsdCBzZXR0aW5ncycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHByaW9yaXRpemUgc3BlY2lmaWVkIHNldHRpbmdzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldERlZmF1bHRTZXR0aW5ncygnL2N3ZCcsIHsgY21kOiAnZWNobyBoZWxsbycsIGN3ZDogJ3JlbGF0aXZlJyB9KSkudG9FcXVhbCh7XG4gICAgICAgIGNtZDogJ2VjaG8gaGVsbG8nLFxuICAgICAgICBjd2Q6ICdyZWxhdGl2ZScsXG4gICAgICAgIGFyZ3M6IFtdLFxuICAgICAgICBlbnY6IHt9LFxuICAgICAgICBzaDogdHJ1ZSxcbiAgICAgICAgZXJyb3JNYXRjaDogJydcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBwb3NzaWJsZSB0byBvdmVycmlkZSBhbnkgYXJndW1lbnQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0RGVmYXVsdFNldHRpbmdzKCcvY3dkJywge1xuICAgICAgICBjbWQ6ICdlY2hvIGhlbGxvJyxcbiAgICAgICAgY3dkOiAncmVsYXRpdmUnLFxuICAgICAgICBhcmdzOiBbICdhcmcxJyBdLFxuICAgICAgICBlbnY6IHsgJ2tleTEnOiAndmFsMScgfSxcbiAgICAgICAgc2g6IGZhbHNlLFxuICAgICAgICBlcnJvck1hdGNoOiAnXnJlZ2V4JCdcbiAgICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICAgY21kOiAnZWNobyBoZWxsbycsXG4gICAgICAgIGN3ZDogJ3JlbGF0aXZlJyxcbiAgICAgICAgYXJnczogWyAnYXJnMScgXSxcbiAgICAgICAgZW52OiB7ICdrZXkxJzogJ3ZhbDEnIH0sXG4gICAgICAgIHNoOiBmYWxzZSxcbiAgICAgICAgZXJyb3JNYXRjaDogJ15yZWdleCQnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdGFrZSB0aGUgc3BlY2lmZWQgY3dkIGlmIG9taXR0ZWQgZnJvbSBzZXR0aW5ncycsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXREZWZhdWx0U2V0dGluZ3MoJy9jd2QnLCB7IGNtZDogJ21ha2UnIH0pKS50b0VxdWFsKHtcbiAgICAgICAgY21kOiAnbWFrZScsXG4gICAgICAgIGN3ZDogJy9jd2QnLFxuICAgICAgICBhcmdzOiBbXSxcbiAgICAgICAgZW52OiB7fSxcbiAgICAgICAgc2g6IHRydWUsXG4gICAgICAgIGVycm9yTWF0Y2g6ICcnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/home/sargon/.atom/packages/build/spec/utils-spec.js
